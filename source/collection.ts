import {Query, Query_Implementation} from './query'
import {Collection_Trellis} from './types'
import {create, create_or_update, update} from './update'

export interface ICollection {
  get_sequelize(): any
}

export class Collection<T> implements ICollection {
  private sequelize
  private trellis: Collection_Trellis<T>
  private primary_key: string

  constructor(trellis: Collection_Trellis<T>, sequelize_model) {
    this.trellis = trellis
    this.sequelize = sequelize_model
    this.primary_key = this.trellis.primary_key.name
    trellis.collection = this
  }

  create(seed): Promise<T> {
    return create(seed, this.trellis, this.sequelize)
  }

  create_or_update(seed): Promise<T> {
    return create_or_update(seed, this.trellis, this.sequelize)
  }

  update(seed, changes?): Promise<T> {
    return update(seed, this.trellis, this.sequelize, changes)
  }

  all(): Query<T> {
    return new Query_Implementation<T>(this.sequelize, this.trellis)
  }

  filter(options): Query<T> {
    return this.all().filter(options)
  }

  first(): Query<T> {
    return this.all().first()
  }

  first_or_null(): Query<T> {
    return this.all().first_or_null()
  }

  get_sequelize() {
    return this.sequelize
  }

  get(identity) {
    if (!identity)
      throw new Error("Cannot get empty identity of type " + this.trellis.name + '.')

    const filter = {}
    filter[this.primary_key] = identity

    return this.filter(filter).first()
  }

}
